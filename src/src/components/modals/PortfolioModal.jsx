import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Play, ExternalLink, Calendar, Clock, User, Tag } from 'lucide-react';

export function PortfolioModal({ item, isOpen, onClose, onPlayVideo }) {
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
          {/* Hero Image/Video */}
          <div className="relative rounded-lg overflow-hidden group">
            <ImageWithFallback
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button 
                size="lg" 
                onClick={onPlayVideo}
                className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 p-0"
              >
                <Play className="w-6 h-6 ml-1" />
              </Button>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/70 text-white">
                {item.category}
              </Badge>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-medium">{item.client}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{mockDetails.duration}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium">{mockDetails.completedDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {mockProjectDetails.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Project Sections */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Challenge</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {mockProjectDetails.challenge}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">Solution</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {mockProjectDetails.solution}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">Results</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {mockProjectDetails.results}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-semibold">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockDetails.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onPlayVideo}
              className="flex-1 bg-gradient-primary text-white btn-hover-primary"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Full Video
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open(item.videoUrl, '_blank')}
              className="flex-1 btn-hover-secondary"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Project
            </Button>
          </div>

          {/* Call to Action */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-2">
              Ready to Create Something Amazing?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Let's discuss your project and bring your vision to life with professional video editing.
            </p>
            <Button 
              onClick={onClose}
              className="bg-gradient-primary text-white btn-hover-primary"
            >
              Start Your Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}