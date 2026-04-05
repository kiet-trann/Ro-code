import React from 'react';

export default function ProfileSkeleton() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
            {/* Nút Quay lại */}
            <div className="w-32 h-6 bg-zinc-800 rounded-md mb-6"></div>

            {/* Khu vực Avatar & Thống kê */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Skeleton */}
                <div className="w-24 h-24 rounded-full bg-zinc-800 shrink-0"></div>

                {/* Info Skeleton */}
                <div className="flex-1 w-full flex flex-col items-center sm:items-start gap-4">
                    <div className="w-48 h-8 bg-zinc-800 rounded-md"></div>
                    <div className="w-32 h-4 bg-zinc-800 rounded-md"></div>

                    {/* 3 Box thống kê */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 w-full">
                        <div className="w-24 h-16 bg-zinc-800 rounded-xl"></div>
                        <div className="w-24 h-16 bg-zinc-800 rounded-xl"></div>
                        <div className="w-24 h-16 bg-zinc-800 rounded-xl"></div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2">
                <div className="w-24 h-8 bg-zinc-800 rounded-md"></div>
                <div className="w-24 h-8 bg-zinc-800 rounded-md"></div>
            </div>
        </div>
    );
}