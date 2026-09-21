import React from "react";
import { IconType } from "react-icons";

interface ContactInfoItemProps {
  icon: IconType;
  title: string;
  content: string;
}

export default function ContactInfoItem({
  icon: Icon,
  title,
  content,
}: ContactInfoItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center  shrink-0">
        <Icon />
      </div>
      <div>
        {title && <h4 className="font-bold text-brand-dark mb-1">{title}</h4>}
        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
}
