import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2, Camera } from 'lucide-react';
import { PROFILE_AVATAR, AVATAR_STORAGE_KEY } from '../config/profile';

type AvatarSource = 'custom' | 'public' | 'google' | 'fallback';

interface ProfileAvatarProps {
  /** URL da foto da conta Google (currentUser.photoURL), se existir. */
  googlePhotoUrl?: string | null;
  /** Se true (dono), permite clicar para subir uma foto própria. */
  editable?: boolean;
  className?: string;
}

const readStoredAvatar = (): string | null => {
  try {
    return localStorage.getItem(AVATAR_STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Avatar do dono no hero do Painel.
 * Ordem de prioridade: foto customizada (upload) > public/perfil.png >
 * foto da conta Google > ícone de controle.
 */
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  googlePhotoUrl,
  editable = false,
  className = '',
}) => {
  const [source, setSource] = useState<AvatarSource>(() => {
    if (readStoredAvatar()) return 'custom';
    return 'public';
  });
  const [customSrc, setCustomSrc] = useState<string | null>(() => readStoredAvatar());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recarrega quando a página volta pro hero após um upload em outra aba.
  useEffect(() => {
    const stored = readStoredAvatar();
    if (stored && stored !== customSrc) {
      setCustomSrc(stored);
      setSource('custom');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) return;
      try {
        localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
      } catch {
        // Cota do localStorage excedida — usa só nesta sessão.
      }
      setCustomSrc(dataUrl);
      setSource('custom');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleError = useCallback(() => {
    setSource((prev) => {
      if (prev === 'public') return googlePhotoUrl ? 'google' : 'fallback';
      return 'fallback';
    });
  }, [googlePhotoUrl]);

  const src =
    source === 'custom' && customSrc
      ? customSrc
      : source === 'public'
        ? PROFILE_AVATAR
        : source === 'google' && googlePhotoUrl
          ? googlePhotoUrl
          : null;

  const inner = src ? (
    <img
      src={src}
      alt="Foto de perfil"
      className="h-full w-full object-cover"
      onError={handleError}
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#161b22] to-[#0d1117] text-[#22d3ee]">
      <Gamepad2 className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  );

  const box = (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-[#22d3ee]/40 shadow-[0_0_24px_rgba(34,211,238,0.25)] ${className}`}
    >
      {inner}
      {editable && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-x-0 bottom-0 flex min-h-[32px] items-center justify-center gap-1 bg-black/60 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#22d3ee] opacity-0 transition-opacity hover:bg-black/75 focus-visible:opacity-100 group-hover/avatar:opacity-100 cursor-pointer"
          aria-label="Subir foto de perfil"
          title="Clique para subir sua foto"
        >
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Foto</span>
        </button>
      )}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      )}
    </div>
  );

  if (!editable) return box;

  return <span className="group/avatar relative block">{box}</span>;
};

export default ProfileAvatar;
