import { NextResponse } from 'next/server';
import type { Book } from '@/types';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const booksFile = path.join(dataDir, 'books.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(booksFile)) {
    fs.writeFileSync(booksFile, '[]', 'utf-8');
  }
}

function getBooks(): Book[] {
  try {
    ensureDataDir();
    const data = fs.readFileSync(booksFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveBooks(books: Book[]) {
  ensureDataDir();
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const books = getBooks();

  if (id) {
    const book = books.find((b) => b.id === id);
    return NextResponse.json({
      success: !!book,
      data: book,
    });
  }

  return NextResponse.json({
    success: true,
    data: books,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, language, grade, subject, lesson_number, chapter, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    const books = getBooks();
    const book: Book = {
      id: Date.now().toString(),
      user_id: 'test-user',
      title,
      content,
      language: language || 'zh-CN',
      grade,
      subject,
      lesson_number,
      chapter,
      author,
      created_at: new Date().toISOString(),
    };

    books.push(book);
    saveBooks(books);

    console.log('书籍保存成功:', book.id, book.title);

    return NextResponse.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('保存错误:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('id');

  if (!idsParam) {
    return NextResponse.json(
      { success: false, error: 'Book ID required' },
      { status: 400 }
    );
  }

  const ids = idsParam.split(',');
  const books = getBooks();
  const remaining = books.filter((b) => !ids.includes(b.id));

  if (remaining.length === books.length) {
    return NextResponse.json(
      { success: false, error: 'Book not found' },
      { status: 404 }
    );
  }

  saveBooks(remaining);

  // Clean up related records
  try {
    const dataDir = path.join(process.cwd(), 'data');
    // Clean scores/records
    const recordsFile = path.join(dataDir, 'records.json');
    if (fs.existsSync(recordsFile)) {
      const records = JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
      const audioUrls = records
        .filter((r: any) => ids.includes(r.book_id) && r.audio_url)
        .map((r: any) => r.audio_url);
      const cleanedRecords = records.filter((r: any) => !ids.includes(r.book_id));
      fs.writeFileSync(recordsFile, JSON.stringify(cleanedRecords, null, 2), 'utf-8');
      // Clean audio files
      const audioDir = path.join(dataDir, 'audio');
      for (const url of audioUrls) {
        const filename = url.split('/').pop();
        if (filename) {
          const audioPath = path.join(audioDir, filename);
          if (fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
          }
        }
      }
    }
  } catch (e) {
    console.error('Clean up records error:', e);
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      );
    }

    const books = getBooks();
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    books[index] = { ...books[index], ...updates, updated_at: new Date().toISOString() };
    saveBooks(books);

    return NextResponse.json({
      success: true,
      data: books[index],
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    );
  }
}