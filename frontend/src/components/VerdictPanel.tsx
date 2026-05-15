import React from 'react'
import { motion } from 'framer-motion'
import { Scale, ThumbsUp, AlertCircle } from 'lucide-react'

interface VerdictData {
    decision: string
    overall_score: number
    reasoning: string
    [key: string]: any
}

export default function VerdictPanel({ verdict }: { verdict: VerdictData }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-5 sm:p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-white">Critic</h4>
                    <p className="text-[10px] text-slate-600">Verdict & Analysis</p>
                </div>
                <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/8 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/10">
                    Complete
                </span>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${verdict.decision === 'APPROVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}
                    >
                        {verdict.decision === 'APPROVE' ? (
                            <ThumbsUp className="w-4 h-4" />
                        ) : (
                            <AlertCircle className="w-4 h-4" />
                        )}
                        {verdict.decision}
                    </div>
                    <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000"
                            style={{ width: `${verdict.overall_score || 0}%` }}
                        />
                    </div>
                    <span className="text-white font-bold">{verdict.overall_score?.toFixed(0)}%</span>
                </div>
                {verdict.reasoning && (
                    <div className="bg-orange-500/5 rounded-lg p-3 border border-orange-500/10">
                        <p className="text-sm text-slate-300">{verdict.reasoning}</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
