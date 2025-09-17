import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, ExternalLink, Calendar, Clock, User, Tag } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayVideo: () => void;
}

export function PortfolioModal({ item, isOpen, onClose, onPlayVideo }: PortfolioModalProps) {
  if (!item) return null;

  const mockProjectDetails = {
    challenge: "The client needed a compelling video that would showcase their innovative SaaS platform while explaining complex technical features in an accessible way.",
    solution: "We created a dynamic promotional video combining screen recordings, custom animations, and professional voiceover to clearly demonstrate the platform's value proposition.",
    results: "The video resulted in a 45% increase in sign-ups and was featured on the company's main landing page, generating over 100,000 views in the first month.",
    technologies: ["Adobe After Effects", "Premiere Pro", "Cinema 4D", "DaVinci Resolve"]
  };

  const mockDetails = {
    duration: "2:30",
    completedDate: new Date('2024-01-15'),
    tags: ['Motion Graphics', 'Color Grading', 'Sound Design', 'Animation']
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Preview */}
          <div className="relative">
            <ImageWithFallback
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
              <Button
                size="lg"
                onClick={onPlayVideo}
                className="rounded-full p-6"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Client: {item.client}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Duration: {mockDetails.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Completed: {mockDetails.completedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockDetails.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Challenge</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockProjectDetails.challenge}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Solution</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockProjectDetails.solution}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Results</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockProjectDetails.results}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Technologies Used */}
          <div>
            <h4 className="font-semibold mb-3">Technologies & Tools</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mockProjectDetails.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-lg text-center text-sm font-medium"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onPlayVideo} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Watch Full Video
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Project
            </Button>
            <Button variant="outline">
              Request Similar Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}