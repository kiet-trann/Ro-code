import React from 'react';

export default function CodeCardSkeleton() {
    return (
        <div className="p-5 rounded-xl border bg-zinc-900 border-zinc-800 animate-pulse">
            {/* Header: Tác giả & Thời gian */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-800 rounded-full"></div>
                    <div className="w-24 h-4 bg-zinc-800 rounded-md"></div>
                </div>
                <div className="w-16 h-4 bg-zinc-800 rounded-md"></div>
            </div>

            {/* Info: Diễn viên & Thể loại */}
            <div className="flex justify-between items-center mb-3">
                <div className="w-32 h-5 bg-zinc-800 rounded-md"></div>
                <div className="w-12 h-5 bg-zinc-800 rounded-md"></div>
            </div>

            {/* Box chứa Code */}
            <div className="bg-black p-4 rounded-lg border border-zinc-800/50 mb-4 h-16 w-full flex justify-between items-center">
                <div className="w-40 h-6 bg-zinc-800 rounded-md"></div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-zinc-800 rounded-md"></div>
                    <div className="w-8 h-8 bg-zinc-800 rounded-md"></div>
                </div>
            </div>

            {/* Footer: Rating, Views & Comments */}
            <div className="flex justify-between items-center">
                <div className="w-28 h-5 bg-zinc-800 rounded-md"></div>
                <div className="w-32 h-5 bg-zinc-800 rounded-md"></div>
            </div>
        </div>
    );
}