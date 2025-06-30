import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
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
              You’ll find here the projects created in the GameLab English
              course. It is one of the myriad themes you can choose in your
              first and second years at CentraleSupélec for your English
              courses.
            </p>

            <p className="text-justify">
              The GameLab is an experimental project class. The course offers
              the space where you can invent, pitch, experiment with, and test
              your game to create an authentic project by the end of the
              semester.
            </p>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm p-8 mb-16 max-w-5xl mx-auto border border-white/20 z-0 relative">
          <div className="grid md:grid-cols-2 gap-8 text-lg leading-relaxed text-white">
            <p className="mb-2 text-justify">
              Computer games, printable card games, tracking and learning apps,
              and physical games all fall within the scope of the GameLab.
            </p>

            <p>Feel free to download, test, and comment on the games.</p>
          </div>
        </Card>

        <h4 className="text-xl font-semibold mb-12 w-full text-center">
          See you in the Lab.
        </h4>
      </div>
    </div>
  );
}
