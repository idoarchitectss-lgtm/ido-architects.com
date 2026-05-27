"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteService } from "@/hooks/admin/services/useDeleteService";

export default function DeleteServiceButton({ id, title }: { id: string; title: string }) {
  const deleteMutation = useDeleteService();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? "Đang xóa..." : "Xóa dịch vụ"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Dịch vụ &ldquo;{title}&rdquo; sẽ bị xóa vĩnh viễn. Không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
