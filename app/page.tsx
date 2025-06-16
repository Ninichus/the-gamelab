import { Award, Gamepad2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const badges = [
  {
    title: "Game Showcase",
    description:
      "Display your creative video games and board games in our digital gallery",
    icon: <Gamepad2 className="h-8 w-8" />,
  },
  {
    title: "Community Lab",
    description:
      "Rate games, share insights, and collaborate with fellow student creators",
    icon: <Users className="h-8 w-8" />,
  },
  {
    title: "Learning Achievement",
    description:
      "Celebrate the innovative fusion of language education and game design",
    icon: <Award className="h-8 w-8" />,
  },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 text-white py-20 overflow-hidden mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold">The GameLab</h2>

          <p className="text-2xl mb-8 opacity-90 max-w-4xl mx-auto">
            Where English Learning Meets Game Creation: Your Gaming Laboratory
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm p-8 mb-12 max-w-5xl mx-auto border border-white/20">
          <div className="grid md:grid-cols-2 gap-8 text-lg leading-relaxed text-white">
            <div>
              <p className="mb-4">
                The GameLab is your creative laboratory where English language
                learning transforms into interactive gaming experiences.
                Students become game designers, crafting unique digital and
                board games during their language courses.
              </p>
              <p className="mb-4">
                From Shakespeare-inspired word puzzles to historical adventure
                games, our platform celebrates the intersection of language
                mastery and creative game development.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Whether you&apos;ve designed a strategic board game exploring
                British literature or coded an interactive journey through
                English history, the GameLab is where your creations come to
                life and reach fellow learners worldwide.
              </p>
              <p>
                Join our community of student developers, discover innovative
                games, share feedback, and celebrate the fusion of education and
                entertainment!
              </p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {badges.map((badge) => {
            return (
              <div className="text-center" key={badge.title}>
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                  {badge.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{badge.title}</h4>
                <p className="opacity-90">{badge.description}</p>
              </div>
            );
          })}
        </div>

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
