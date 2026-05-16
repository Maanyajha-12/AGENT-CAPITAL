// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgentMarketplace
 * @dev Secondary marketplace for buying, selling, and trading agent iNFTs
 * Implements price discovery and historical tracking
 */

contract AgentMarketplace {
    // ============= Structs =============

    struct Listing {
        uint256 listingId;
        uint256 agentId;
        address seller;
        uint256 askPrice;
        uint256 listedAt;
        bool isActive;
    }

    struct Sale {
        uint256 saleId;
        uint256 agentId;
        address seller;
        address buyer;
        uint256 price;
        uint256 timestamp;
    }

    struct PriceHistory {
        uint256[] prices;
        uint256[] timestamps;
    }

    // ============= State Variables =============

    Listing[] public listings;
    Sale[] public sales;
    mapping(uint256 => PriceHistory) internal priceHistory; // agentId => price history (use getPriceHistory())

    address public nftContract;
    address public agentCapitalContract;
    address public admin;

    uint256 public platformFeePercentage = 5; // 5% platform fee
    uint256 public totalSalesVolume = 0;

    // ============= Events =============

    event ListingCreated(uint256 indexed listingId, uint256 indexed agentId, address seller, uint256 askPrice);
    event ListingCanceled(uint256 indexed listingId, uint256 indexed agentId);
    event SaleCompleted(uint256 indexed saleId, uint256 indexed agentId, address seller, address buyer, uint256 price);
    event PriceUpdated(uint256 indexed agentId, uint256 price, uint256 timestamp);

    // ============= Constructor =============

    constructor() {
        admin = msg.sender;
    }

    // ============= Listing Management =============

    /**
     * @dev Create a new listing for an agent
     */
    function listAgent(uint256 _agentId, uint256 _askPrice) external {
        require(_askPrice > 0, "Price must be > 0");
        require(msg.sender == tx.origin || msg.sender == nftContract, "Invalid caller");

        Listing memory newListing = Listing({
            listingId: listings.length,
            agentId: _agentId,
            seller: msg.sender,
            askPrice: _askPrice,
            listedAt: block.timestamp,
            isActive: true
        });

        listings.push(newListing);

        emit ListingCreated(newListing.listingId, _agentId, msg.sender, _askPrice);
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 _listingId) external {
        require(_listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[_listingId];
        require(msg.sender == listing.seller, "Only seller can cancel");
        require(listing.isActive, "Listing already inactive");

        listing.isActive = false;

        emit ListingCanceled(_listingId, listing.agentId);
    }

    // ============= Purchase =============

    /**
     * @dev Buy an agent from a listing
     */
    function buyAgent(uint256 _listingId) external payable {
        require(_listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[_listingId];

        require(listing.isActive, "Listing not active");
        require(msg.value >= listing.askPrice, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own listing");

        uint256 saleId = sales.length;

        // Record sale
        Sale memory sale = Sale({
            saleId: saleId,
            agentId: listing.agentId,
            seller: listing.seller,
            buyer: msg.sender,
            price: listing.askPrice,
            timestamp: block.timestamp
        });
        sales.push(sale);

        // Update price history
        priceHistory[listing.agentId].prices.push(listing.askPrice);
        priceHistory[listing.agentId].timestamps.push(block.timestamp);

        // Calculate fees
        uint256 platformFee = (listing.askPrice * platformFeePercentage) / 100;
        uint256 sellerProceeds = listing.askPrice - platformFee;

        // Transfer funds
        payable(listing.seller).transfer(sellerProceeds);
        payable(admin).transfer(platformFee);

        // Handle overpayment
        if (msg.value > listing.askPrice) {
            payable(msg.sender).transfer(msg.value - listing.askPrice);
        }

        // Deactivate listing
        listing.isActive = false;

        // Update volume
        totalSalesVolume += listing.askPrice;

        emit SaleCompleted(saleId, listing.agentId, listing.seller, msg.sender, listing.askPrice);
        emit PriceUpdated(listing.agentId, listing.askPrice, block.timestamp);
    }

    // ============= Queries =============

    /**
     * @dev Get active listings
     */
    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].isActive) {
                activeCount++;
            }
        }

        Listing[] memory active = new Listing[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].isActive) {
                active[index] = listings[i];
                index++;
            }
        }

        return active;
    }

    /**
     * @dev Get listings by agent ID
     */
    function getListingsByAgent(uint256 _agentId) external view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].agentId == _agentId && listings[i].isActive) {
                count++;
            }
        }

        Listing[] memory result = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].agentId == _agentId && listings[i].isActive) {
                result[index] = listings[i];
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Get price history for an agent
     */
    function getPriceHistory(uint256 _agentId)
        external
        view
        returns (uint256[] memory prices, uint256[] memory timestamps)
    {
        return (priceHistory[_agentId].prices, priceHistory[_agentId].timestamps);
    }

    /**
     * @dev Get average price for an agent (last N sales)
     */
    function getAveragePrice(uint256 _agentId, uint256 _limit) external view returns (uint256) {
        uint256[] memory prices = priceHistory[_agentId].prices;

        if (prices.length == 0) return 0;

        uint256 limit = _limit < prices.length ? _limit : prices.length;
        uint256 sum = 0;

        for (uint256 i = prices.length - limit; i < prices.length; i++) {
            sum += prices[i];
        }

        return sum / limit;
    }

    /**
     * @dev Get sales count
     */
    function getTotalSales() external view returns (uint256) {
        return sales.length;
    }

    /**
     * @dev Get sale by ID
     */
    function getSale(uint256 _saleId) external view returns (Sale memory) {
        require(_saleId < sales.length, "Invalid sale ID");
        return sales[_saleId];
    }

    /**
     * @dev Get sales by agent
     */
    function getSalesByAgent(uint256 _agentId) external view returns (Sale[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < sales.length; i++) {
            if (sales[i].agentId == _agentId) {
                count++;
            }
        }

        Sale[] memory result = new Sale[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < sales.length; i++) {
            if (sales[i].agentId == _agentId) {
                result[index] = sales[i];
                index++;
            }
        }

        return result;
    }

    // ============= Admin Functions =============

    /**
     * @dev Set platform fee percentage
     */
    function setPlatformFeePercentage(uint256 _percentage) external {
        require(msg.sender == admin, "Only admin");
        require(_percentage <= 20, "Fee too high");
        platformFeePercentage = _percentage;
    }

    /**
     * @dev Set NFT contract address
     */
    function setNFTContract(address _nftContract) external {
        require(msg.sender == admin, "Only admin");
        nftContract = _nftContract;
    }

    /**
     * @dev Set AgentCapital contract address
     */
    function setAgentCapitalContract(address _agentCapitalContract) external {
        require(msg.sender == admin, "Only admin");
        agentCapitalContract = _agentCapitalContract;
    }
}
