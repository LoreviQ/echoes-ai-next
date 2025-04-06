import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

// Function to convert hashtags to markdown links
function processHashtags(content: string): string {
    // Match hashtags that start with # and contain letters, numbers, and underscores
    return content.replace(/#(\w+)/g, '[$&](/search?hashtag=$1)');
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
    const processedContent = processHashtags(content);
    // Split content by newlines and filter out empty lines
    const contentSections = processedContent.split('\n').filter(section => section.trim() !== '');

    return (
        <div className="flex flex-col gap-2">
            {contentSections.map((section, index) => (
                <ReactMarkdown
                    key={index}
                    components={{
                        p: ({ children }) => (
                            <p className={`whitespace-pre-wrap prose prose-invert prose-sm max-w-none ${className}`}>
                                {children}
                            </p>
                        ),
                        a: ({ href, children }) => (
                            <a href={href} className="text-sky-500 hover:underline">
                                {children}
                            </a>
                        )
                    }}
                >
                    {section}
                </ReactMarkdown>
            ))}
        </div>
    );
} 