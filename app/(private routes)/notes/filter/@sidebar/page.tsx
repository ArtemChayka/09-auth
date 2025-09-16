import React from 'react';
import TagsMenu from '@/components/TagsMenu/TagsMenu';
import { MOCK_NOTES } from '@/lib/api/api';

export default function SidebarPage() {
  const allTags = MOCK_NOTES.flatMap((note) => note.tags);

  const uniqueTagMap = new Map<string, any>();
  allTags.forEach((tag) => {
    uniqueTagMap.set(tag.name, tag);
  });
  const uniqueTags = Array.from(uniqueTagMap.values());

  return <TagsMenu tags={uniqueTags} />;
}
