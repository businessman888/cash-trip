'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'

interface NewTripChatBubbleProps {
    message: string
    sender: 'aurora' | 'user'
}

export function NewTripChatBubble({ message, sender }: NewTripChatBubbleProps) {
    const isAurora = sender === 'aurora'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col ${isAurora ? 'items-start' : 'items-end'} mb-4`}
        >
            <span className="text-[12px] text-[#64748B] mb-1 ml-1">
                {isAurora ? 'Aurora' : 'Você'}
            </span>
            <div
                className={`p-5 rounded-[20px] text-[15px] font-inria-sans font-medium leading-relaxed max-w-[90%] shadow-sm overflow-hidden
                ${isAurora
                        ? 'bg-[#FF5F38] text-white rounded-tl-none'
                        : 'bg-[#FF896F] text-white rounded-tr-none'
                    }`}
            >
                {isAurora ? (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Style headers
                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 border-b border-white/20 pb-1" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2 text-yellow-200" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
                            // Style lists
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                            // Style emphasis
                            strong: ({ node, ...props }) => <strong className="font-bold text-yellow-100" {...props} />,
                            em: ({ node, ...props }) => <em className="italic opacity-90" {...props} />,
                            // Style paragraphs
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            // Style blockquotes
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-white/30 pl-3 italic my-2 bg-white/10 p-2 rounded-r" {...props} />,
                            // Style horizontal rules
                            hr: ({ node, ...props }) => <hr className="border-white/20 my-4" {...props} />,
                            // Style links
                            a: ({ node, ...props }) => <a className="text-blue-200 hover:text-white underline decoration-blue-200/50 hover:decoration-white transition-colors font-bold" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                    >
                        {message}
                    </ReactMarkdown>
                ) : (
                    message
                )}
            </div>
        </motion.div>
    )
}
