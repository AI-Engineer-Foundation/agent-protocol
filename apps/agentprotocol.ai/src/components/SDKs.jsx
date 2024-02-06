import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const sdks = [
  {
    href: '/sdks',
    name: 'Overview',
    description: 'Learn about the different SDKs available.',
  },
  {
    href: '/sdks/python',
    name: 'Python',
    description: 'Learn how to use the Python SDK.',
  },
  {
    href: '/sdks/js',
    name: 'JavaScript & TypeScript',
    description: 'Learn how to use the JavaScript & TypeScript SDK.',
  },
  {
    href: '/sdks/custom',
    name: 'Custom implementation',
    description: 'Learn how to implement the Agent Protocol on your own.',
  },
]

export function SDKs() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="sdks">
        SDKs
      </Heading>
      Our implementation of the Agent Communication Protocol to help you get
      started. The SDK provides a simple interface to the protocol and allows
      you to easily create agents that integrates Agent Protocol.
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {sdks.map((sdk) => (
          <div key={sdk.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {sdk.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {sdk.description}
            </p>
            <p className="mt-4">
              <Button href={sdk.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
