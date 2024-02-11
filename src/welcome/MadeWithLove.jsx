import { PACKAGE_VERSION } from '@/values/PackageJSON';

export default function MadeWithLove() {
  return (
    <output className="fixed bottom-4 right-4 m-2 font-mono text-xs opacity-30">
      <a href="https://github.com/andykuo1" target="_blank">
        <span className="p-2">Made with ❤️</span>
        <span>EagleSlate v{PACKAGE_VERSION.toString()}</span>
      </a>
    </output>
  );
}
