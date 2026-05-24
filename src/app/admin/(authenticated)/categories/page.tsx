"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import AdminModal from "@/app/admin/_components/AdminModal";
import CategoryForm, {
  type CategoryFormValues,
} from "@/app/admin/_components/CategoryForm";
import { useAdminToast } from "@/app/admin/_hooks/useAdminToast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  postCount: number;
  createdAt: string;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const toast = useAdminToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ─── Open Modal ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  // ─── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async (data: CategoryFormValues) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg =
        typeof body.error === "string" ? body.error : "Có lỗi xảy ra";
      toast.error("Tạo thất bại", msg);
      return;
    }

    toast.success("Tạo thành công!", `Chuyên mục "${data.name}" đã được thêm.`);
    closeModal();
    fetchCategories();
  };

  // ─── Update ─────────────────────────────────────────────────────────────────
  const handleUpdate = async (data: CategoryFormValues) => {
    if (!editTarget) return;
    const res = await fetch(`/api/categories/${editTarget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg =
        typeof body.error === "string" ? body.error : "Có lỗi xảy ra";
      toast.error("Cập nhật thất bại", msg);
      return;
    }

    toast.success("Đã cập nhật!", `Chuyên mục "${data.name}" đã được lưu.`);
    closeModal();
    fetchCategories();
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (cat: Category) => {
    const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Xóa thất bại", "Không thể xóa chuyên mục này.");
      return;
    }
    toast.success("Đã xóa!", `Chuyên mục "${cat.name}" đã bị xóa.`);
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setDeletingId(null);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chuyên mục</h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý chuyên mục cho bài viết và dự án
            </p>
          </div>
          <Button onClick={openCreate} size="sm">
            <Plus size={16} className="mr-1.5" />
            Thêm chuyên mục
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">
              Đang tải...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-14 text-center">
              <Tag size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                Chưa có chuyên mục nào
              </p>
              <Button onClick={openCreate} variant="outline" size="sm">
                <Plus size={14} className="mr-1" /> Thêm ngay
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Tên
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Slug
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                    Mô tả
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 w-24">
                    Bài viết
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 w-24">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate hidden md:table-cell">
                      {cat.description ?? (
                        <span className="text-gray-300 italic text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="secondary">{cat.postCount}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900"
                          onClick={() => openEdit(cat)}
                        >
                          <Pencil size={14} />
                        </Button>

                        {/* Delete */}
                        <AlertDialog
                          open={deletingId === cat.id}
                          onOpenChange={(open) =>
                            setDeletingId(open ? cat.id : null)
                          }
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa chuyên mục?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Chuyên mục{" "}
                                <span className="font-semibold text-gray-900">
                                  &ldquo;{cat.name}&rdquo;
                                </span>{" "}
                                sẽ bị xóa vĩnh viễn.
                                {cat.postCount > 0 && (
                                  <span className="block mt-1 text-orange-600">
                                    ⚠ {cat.postCount} bài viết trong chuyên mục
                                    này sẽ bị tách liên kết.
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleDelete(cat)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? "Chỉnh sửa chuyên mục" : "Thêm chuyên mục mới"}
        description={
          editTarget
            ? `Đang chỉnh sửa: ${editTarget.name}`
            : "Điền thông tin để tạo chuyên mục mới."
        }
        size="md"
      >
        <CategoryForm
          key={editTarget?.id ?? "create"}
          defaultValues={
            editTarget
              ? {
                  name: editTarget.name,
                  slug: editTarget.slug,
                  description: editTarget.description ?? "",
                }
              : undefined
          }
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onCancel={closeModal}
          submitLabel={editTarget ? "Lưu thay đổi" : "Tạo chuyên mục"}
        />
      </AdminModal>
    </>
  );
}

