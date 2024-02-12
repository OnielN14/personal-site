import { FormControl, FormFieldProvider, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import {
    MDXEditor, diffSourcePlugin,
    markdownShortcutPlugin,
    AdmonitionDirectiveDescriptor,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    sandpackPlugin,
    KitchenSinkToolbar
} from "@mdxeditor/editor"
import '@mdxeditor/editor/style.css'
import MdUploadImage from "./MdUploadImage.client";
import { useRemixFormContext } from "remix-hook-form";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()

const imageUploadHandler = async (image: File) => {
    const formData = new FormData()
    formData.set('image', image)

    const response = await fetch("/api/image/upload", {
        method: 'post',
        body: formData
    })
    const json = (await response.json()) as { url: string }

    return json.url
}

export default function MdEditorField() {
    const { register, setValue, getValues, trigger } = useRemixFormContext()
    const field = register('content')

    const plugins = [
        headingsPlugin(), listsPlugin(), quotePlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        linkPlugin(),
        imagePlugin({
            imageUploadHandler,
            ImageDialog: MdUploadImage
        }),
        linkDialogPlugin(),
        directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor]
        }),
        frontmatterPlugin(),
        codeBlockPlugin({
            defaultCodeBlockLanguage: 'txt'
        }),
        sandpackPlugin({
            sandpackConfig: {
                defaultPreset: 'react',
                presets: [
                    {
                        label: 'React',
                        name: 'react',
                        meta: 'live react',
                        sandpackTemplate: 'react',
                        sandpackTheme: 'light',
                        snippetFileName: '/App.js',
                        snippetLanguage: 'jsx',
                        initialSnippetContent: defaultSnippetContent
                    }
                ]
            }
        }),
        codeMirrorPlugin({
            codeBlockLanguages: {
                'txt': 'text',
                'js': 'JavaScript',
                'jsx': 'JavaScript XML',
                'ts': 'TypeScript',
                'tsx': 'TypeScript XML',
                'rs': 'Rust',
                'c': 'C',
                'c++': 'C++',
                'css': 'CSS'
            }
        }),
        diffSourcePlugin(),
        toolbarPlugin({
            toolbarContents: () => <KitchenSinkToolbar />
        }),
        markdownShortcutPlugin(),
    ]

    return (
        <FormFieldProvider name="content">
            <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                    <div className="border border-gray-200 rounded-md">
                        <MDXEditor
                            ref={field.ref}
                            onBlur={(ev) => {
                                field.onBlur(ev)
                                trigger('content')
                            }}
                            onChange={(markdown) => {
                                setValue('content', markdown)
                            }}
                            markdown={getValues('content') ?? ""}
                            readOnly={field.disabled}
                            plugins={plugins}
                            className="relative"
                            contentEditableClassName="prose prose-main lg:prose-xl font-inter min-h-[300px] max-w-full" />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormFieldProvider>
    )
}