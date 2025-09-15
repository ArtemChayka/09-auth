'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api';
import { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [formData, setFormData] = useState(draft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Синхронізуємо локальний стан з draft зі store
  useEffect(() => {
    setFormData(draft);
  }, [draft]);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      setErrors({ submit: 'Помилка при створенні нотатки. Спробуйте ще раз.' });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Назва є обов'язковим полем";
    } else if (formData.title.length < 3) {
      newErrors.title = 'Назва повинна містити принаймні 3 символи';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Назва не повинна перевищувати 50 символів';
    }

    if (formData.content.length > 500) {
      newErrors.content = 'Зміст не повинен перевищувати 500 символів';
    }

    if (!formData.tag) {
      newErrors.tag = "Тег є обов'язковим полем";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    setDraft(updatedData);

    // Очищуємо помилку для цього поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createMutation.mutate({
      title: formData.title.trim(),
      content: formData.content.trim(),
      tag: formData.tag,
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Назва *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={css.input}
          placeholder="Введіть назву нотатки"
          disabled={createMutation.isPending}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Зміст</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={8}
          className={css.textarea}
          placeholder="Введіть зміст нотатки"
          disabled={createMutation.isPending}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
        <div className={css.charCount}>
          {formData.content.length}/500 символів
        </div>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Тег *</label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={(e) => handleInputChange('tag', e.target.value as NoteTag)}
          className={css.select}
          disabled={createMutation.isPending}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Робота</option>
          <option value="Personal">Особисте</option>
          <option value="Meeting">Зустрічі</option>
          <option value="Shopping">Покупки</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {errors.submit && <div className={css.error}>{errors.submit}</div>}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Скасувати
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending || !formData.title.trim()}
        >
          {createMutation.isPending ? 'Створення...' : 'Створити нотатку'}
        </button>
      </div>
    </form>
  );
}
