'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LockOverlayProps {
	isLocked: boolean;
	message: string;
	className?: string; // Extra classes for the overlay container
	roundedClassName?: string; // e.g., 'rounded-3xl' to match parent rounding
}

const LockOverlay: React.FC<LockOverlayProps> = ({ isLocked, message, className, roundedClassName }) => {
	if (!isLocked) return null;

	return (
		<div className={cn('absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm', roundedClassName, className)}>
			<div className="flex flex-col items-center text-center space-y-2 p-4">
				<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
					<Lock className="w-5 h-5 text-muted-foreground" />
				</div>
				<p className="text-sm text-muted-foreground max-w-xs">{message}</p>
			</div>
		</div>
	);
};

export default LockOverlay;


