export interface NoteTag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: NoteTag[];
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
