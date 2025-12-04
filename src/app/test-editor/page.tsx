// src/app/test-editor/page.tsx

'use client';

import { useState } from 'react';
import { TiptapEditor } from '@/components/author/editor/tiptap-editor';

export default function TestEditorPage() {
  const [content, setContent] = useState<any>(null);

  const handleSave = (json: any) => {
    console.log('💾 Contenu sauvegardé:', json);
    // Ici vous appelleriez votre API
  };

  const handleUpdate = (json: any) => {
    setContent(json);
    console.log('✏️ Mise à jour:', json);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space-blue to-onyx">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative)' }}>
            Immers'Write Editor
          </h1>
          <p className="text-lavender">Write stories beyond words</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <TiptapEditor
            content={content}
            onUpdate={handleUpdate}
            onSave={handleSave}
            placeholder="Commencez à écrire votre histoire immersive..."
            autoSave={true}
            autoSaveDelay={10000} // 10 secondes pour les tests
          />
        </div>

        {/* Affichage du JSON (pour debug) */}
        <details className="mt-8 bg-white rounded-lg shadow-lg p-4">
          <summary className="cursor-pointer font-semibold text-gray-700">
            📋 Voir le JSON généré
          </summary>
          <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded overflow-x-auto text-xs">
            {JSON.stringify(content, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}