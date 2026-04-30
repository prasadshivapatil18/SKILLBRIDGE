"use client";

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

const languages = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "it", label: "Italian" },
  { code: "en", label: "English" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "bn", label: "Bengali" },
];

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-lg">language</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-white text-sm rounded-lg 
                   px-3 py-1.5 border border-gray-600 
                   cursor-pointer focus:outline-none 
                   focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
