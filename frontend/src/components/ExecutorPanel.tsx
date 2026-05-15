import React from 'react'
import { motion } from 'framer-motion'
import { Play, ExternalLink, CheckCircle } from 'lucide-react'

interface ExecutorData {
    tx_hash?: string
    status: string
    result: any
    [key: string]: any
}

export default function ExecutorPanel({ execution }: { execution: ExecutorData }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-5 sm:p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-white">Executor</h4>
                    <p className="text-[10px] text-slate-600">Action Execution</p>
                </div>
                <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/8 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/10">
                    Complete
                </span>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="font-semibold text-green-400">Execution Successful</span>
                    </div>
                </div>
                {execution.tx_hash && (
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/10">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Transaction Hash</p>
                        <a
                            href={`https://chainscan-galileo.0g.ai/tx/${execution.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 break-all font-mono"
                        >
                            {execution.tx_hash}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                    </div>
                )}
                {execution.result && (
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/10">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Result</p>
                        <pre className="text-xs text-slate-300 overflow-auto max-h-40">
                            {JSON.stringify(execution.result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
