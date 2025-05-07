import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationControlsProps {
  page: number;
  pages: number;
  loading: boolean;
  onPageChange: (newPage: number) => void;
}

export function PaginationControls({
  page,
  pages,
  loading,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page > 1 ? page - 1 : 1)}
        disabled={page === 1 || loading}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      <div className="text-sm text-muted-foreground">
        Page {page} of {pages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page < pages ? page + 1 : pages)}
        disabled={page === pages || loading}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}