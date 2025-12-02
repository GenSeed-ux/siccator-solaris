import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Linkedin, Mail, MessageSquare, Github, Award, Briefcase } from "lucide-react";
import { XTwitterIcon } from "@/components/icons/XTwitterIcon";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  expertise?: string;
  image_url?: string;
  linkedin_url?: string;
  email?: string;
  discord_username?: string;
  twitter_url?: string;
  github_url?: string;
}

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberModal = ({ member, isOpen, onClose }: TeamMemberModalProps) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{member.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="flex-shrink-0">
            {member.image_url ? (
              <img
                src={member.image_url}
                alt={member.name}
                className="w-40 h-40 md:w-48 md:h-48 rounded-xl object-cover mx-auto"
              />
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl gradient-primary mx-auto" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{member.name}</h2>
              <p className="text-lg text-primary font-medium">{member.title}</p>
            </div>

            {member.bio && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  About
                </h3>
                <p className="text-foreground/90 leading-relaxed">{member.bio}</p>
              </div>
            )}

            {member.expertise && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Expertise
                </h3>
                <p className="text-foreground/90">{member.expertise}</p>
              </div>
            )}

            {/* Social Links */}
            {(member.linkedin_url || member.email || member.discord_username || member.twitter_url || member.github_url) && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Connect
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] transition-all"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-sm font-medium">Email</span>
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all"
                    >
                      <XTwitterIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">X</span>
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all"
                    >
                      <Github className="h-5 w-5" />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                  )}
                  {member.discord_username && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2]">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm font-medium">{member.discord_username}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberModal;
