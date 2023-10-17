import os
from pathlib import Path

CODE_PERMA_LINK ='[https://github.com/vechainfoundation/vechain-sdk/blob/'
PERMA_LINK_END = ']'
SNIPPET_HEADER = '```typescript { name=<name>, category=example }'
SNIPPET_FOOTER = '```'

def build_snippet_from_file(file_path: str) -> str:
    snippet_file = Path(file_path)
    snippet_content = snippet_file.read_text()
    snippet_name =  os.path.splittext(os.path.basename(snippet_file))[0]
    snippet_header = SNIPPET_HEADER.replace('<name>', snippet_name)
    snippet = f"{snippet_header}\n{snippet_content}\n{SNIPPET_FOOTER}\n"
    return snippet

def replace_perma_link(content: str, start_index: int) -> str:
    print(f"\t\tReplacing link at position {start_index}")
    finish_index = content.find(PERMA_LINK_END, start_index + 1)
    temp_link = content[start_index:finish_index].replace(CODE_PERMA_LINK, '')
    first_slash = temp_link.find('/')
    snippet_file = temp_link[first_slash:]
    snippet_content = build_snippet_from_file(snippet_file)
    content_list = content.split()
    content_list.insert(finish_index+1, snippet_content)
    return " ".join(content_list)

def build_md_file(mk_file_name: str):
    print(f"\tBuilding file {mk_file_name}")
    try:
        md_file = Path(mk_file_name)
        mk_content = md_file.read_text()
        start_index = 0
        while True:
            link_index = mk_content.find(CODE_PERMA_LINK, start_index)
            if link_index == -1:
                break
            else:
                replace_perma_link(mk_content, link_index)
                start_index = link_index + 1
    except Exception as e:
        print(f"\tUnable to build file {mk_file_name}")
        raise e

def get_markdown_files() -> []:
    files = [f.lower() for f in os.listdir() if os.path.isfile(f) and f.endswith('.md')]
    files.remove('readme.md')
    print(f"\t{len(files)} markdown files found")
    return files

def main():
    print('Replacing code snippets in markdown files:')
    md_files = get_markdown_files()
    for mdfile in md_files:
        build_md_file(mdfile)

if __name__ == '__main__':
    main()