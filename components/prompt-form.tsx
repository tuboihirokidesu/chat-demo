import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button, buttonVariants } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import toast from 'react-hot-toast'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { ImageIcon } from 'lucide-react'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const [imageUpload, setImageUpload] = React.useState<ImageListType>([])

  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const onChangeImage = (imageList: ImageListType) => {
    const file = imageList[0]?.file
    const maxFileSize = 5 * 1024 * 1024

    // ファイルサイズチェック
    if (file && file.size > maxFileSize) {
      toast.error('ファイルサイズは5MBを超えることはできません')
      return
    }

    setImageUpload(imageList)

    // 画像アップロード後にテキストエリアにフォーカスを戻す
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow overflow-hidden px-8 sm:rounded-md sm:border sm:px-12">
        <ImageUploading
          value={imageUpload}
          onChange={onChangeImage}
          maxNumber={1}
          acceptType={['jpg', 'png', 'jpeg']}
        >
          {({ imageList, onImageUpdate }) => (
            <div className="absolute left-0 top-4 h-8 w-8 p-0 sm:left-4">
              <button
                onClick={() => onImageUpdate(0)}
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'relative'
                )}
              >
                <IconPlus className="flex items-center justify-center" />
                {imageList.length > 0 && (
                  <span className="absolute right-[-4px] top-[-4px] flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-xs text-white">
                    <ImageIcon className="h-3 w-3" />
                  </span>
                )}
                <span className="sr-only">Upload Image</span>
              </button>
            </div>
          )}
        </ImageUploading>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
