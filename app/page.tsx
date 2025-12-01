import { Card } from "@/components/ui/card";

export default async function Home() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 text-white py-20 overflow-hidden mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-2xl mb-8 opacity-90 max-w-4xl mx-auto font-bold">
            Welcome to the online showcase of the GameLab at CentraleSupélec.
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm p-8 mb-[-20] max-w-5xl mx-auto border border-white/20 z-10 relative shadow-lg shadow-black/30">
          <div className="grid md:grid-cols-2 gap-8 text-lg leading-relaxed text-white">
            <p className="text-justify">
              Here you&apos;ll find projects created in the GameLab, an experimental 
              English course offered at CentraleSupélec. It&apos;s one of several 
              electives available in your first and second years.
            </p>
            <p className="text-justify">
              The course gives you space to invent, pitch, experiment with, and 
              test your game, completing a finished project by semester&apos;s end. 
              Computer games, card games, learning apps, and physical games all fall within scope.
              Feel free to download, test, and comment.
            </p>
          </div>
        </Card>

        <h4 className="text-xl font-semibold mb-12 w-full text-center">
          See you in the Lab.
        </h4>
      </div>
    </div>
  );
}
