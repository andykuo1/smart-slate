import MediaRecorderBooth from '@/recorder/MediaRecorderBooth';

export default function CameraPage() {
  return (
    <main className="w-full h-full flex flex-col items-center bg-black">
      <MediaRecorderBooth />
    </main>
  );
}
