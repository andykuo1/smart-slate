import { PACKAGE_VERSION } from '@/constants/PackageJSON';

export default function MadeWithLove() {
  return (
    <output className="fixed bottom-4 right-4 font-mono text-xs m-2 opacity-30">
      <a href="https://github.com/andykuo1" target="_blank">
        <span className="p-2">Made with ❤️</span>
        <span>EagleSlate v{PACKAGE_VERSION.toString()}</span>
      </a>
    </output>
  );
}
