import os
from pathlib import Path

FILE_TAG = 'file:'
CODE_BLOCK_HEADER = '```typescript { name=<name>, category=example }'
CODE_BLOCK = '```'
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
BUILD_DIR = os.path.join(CURRENT_DIR, "build")

def get_snippet(file_line: str) -> str:
    """ Gets snippet text from referenced file """
    print(f"\t\tGetting snippet from: {file_line}")
    snippet_file_rel_path = file_line.replace(FILE_TAG, '').strip()
    snippet_file_abs_path = os.path.join(CURRENT_DIR, Path(snippet_file_rel_path))
    snippet_content = Path(snippet_file_abs_path).read_text()
    return snippet_content

def build_md_file(md_file_name: str):
    """ Builds individual markdown file"""
    print(f"\tBuilding file {md_file_name}")
    try:
        input_file_path = Path(md_file_name)
        output_file_path = Path(os.path.join(BUILD_DIR, os.path.basename(input_file_path)))
        input_content = input_file_path.read_text().splitlines()
        for line_index in range(0, len(input_content)):
            if FILE_TAG in input_content[line_index]:
                snippet = get_snippet(input_content[line_index])
                with output_file_path.open("a") as f:
                    f.write(f"{snippet}\n")
            else:
                with output_file_path.open("a") as f:
                    f.write(f"{input_content[line_index]}\n") 
    except Exception as e:
        print(f"\tUnable to build file {md_file_name}")
        raise e

def get_markdown_files() -> []:
    """ Gets list of markdown files to process"""
    files = [f.lower() for f in os.listdir() if os.path.isfile(f) and f.endswith('.md')]
    files.remove('readme.md')
    print(f"\t{len(files)} markdown files found")
    return files

def main():
    """ Entry point """
    print('Replacing code snippets in markdown files:')
    md_files = get_markdown_files()
    for mdfile in md_files:
        build_md_file(mdfile)

if __name__ == '__main__':
    main()