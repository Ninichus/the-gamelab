import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 text-white py-20 overflow-hidden mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold">The GameLab</h2>

          <p className="text-2xl mb-8 opacity-90 max-w-4xl mx-auto">
            Welcome to the online showcase of the GameLab at CentraleSupélec.
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm p-8 mb-12 max-w-5xl mx-auto border border-white/20">
          <div className="grid md:grid-cols-2 gap-8 text-lg leading-relaxed text-white">
            <div>
              <p className="mb-4">
                You’ll find here the projects created in the GameLab English
                course. It is one of the myriad themes you can choose in your
                first and second years at CentraleSupélec for your English
                courses.
              </p>
              <p className="mb-4">
                Computer games, printable card games, tracking and learning
                apps, and physical games all fall within the scope of the
                GameLab.
              </p>
            </div>
            <div>
              <p className="mb-4">
                The GameLab is an experimental project class. The course offers
                the space where you can invent, pitch, experiment with, and test
                your game to create an authentic project by the end of the
                semester.
              </p>
              <p>Feel free to download, test, and comment on the games.</p>
            </div>
          </div>
        </Card>

        <h4 className="text-xl font-semibold mb-12 w-full text-center">
          See you in the Lab.
        </h4>

        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center">
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-300 font-semibold px-8 py-4 text-lg shadow-lg cursor-pointer"
              >
                <Gamepad2 className="h-6 w-6 mr-3" />
                Explore Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
