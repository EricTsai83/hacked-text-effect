import HackedTextEffect from "@/components/hacked-text-effect";

export default function HackedTextEffectDemo({}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <HackedTextEffect
        className="w-[400px] text-7xl"
        initialText="ERICTSAI"
        initialTextColor="white"
        backgroundFadeInSpeed={1.8}
        backgroundFadeOutSpeed={5}
      />
    </div>
  );
}
