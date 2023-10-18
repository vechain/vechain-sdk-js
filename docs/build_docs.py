import os
from pathlib import Path

FILE_TAG = '[example]'
CODE_BLOCK_HEADER = '```typescript { name=<name>, category=example }'
CODE_BLOCK = '```'
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
BUILD_DIR = os.path.join(CURRENT_DIR, "build")
TEMPLATE_DIR = os.path.join(CURRENT_DIR, "templates")

def get_snippet(file_line: str) -> str:
    """ Gets snippet text from referenced file """
    print(f"\t\tGetting snippet from: {file_line}")
    snippet_file_rel_path = file_line.replace(FILE_TAG, '').replace('(','').replace(')','').strip()
    snippet_file_abs_path = os.path.join(CURRENT_DIR, Path(snippet_file_rel_path))
    snippet_content = Path(snippet_file_abs_path).read_text()
    return snippet_content

def build_md_file(md_file_name: str):
    """ Builds individual markdown file"""
    print(f"\tBuilding file {md_file_name}")
    try:
        input_file_name = os.path.basename(md_file_name).replace('.md', '')
        snippet_counter = 0
        input_file_path = Path(md_file_name)
        output_file_path = Path(os.path.join(BUILD_DIR, os.path.basename(input_file_path)))
        input_content = input_file_path.read_text().splitlines()
        for line_index in range(0, len(input_content)):
            if FILE_TAG in input_content[line_index]:
                snippet_content = get_snippet(input_content[line_index])
                with output_file_path.open("a") as f:
                    f.write(f"{CODE_BLOCK_HEADER.replace('<name>', f'{input_file_name}{snippet_counter}')}\n")
                    f.write(f"{snippet_content}\n")
                    f.write(f"{CODE_BLOCK}\n")
                snippet_counter += 1
            else:
                with output_file_path.open("a") as f:
                    f.write(f"{input_content[line_index]}\n") 
    except Exception as e:
        print(f"\tUnable to build file {md_file_name}")
        raise e

def get_template_files() -> []:
    """ Gets list of template markdown files to process"""
    files = [f.lower() for f in os.listdir(TEMPLATE_DIR) if os.path.isfile(f) and f.endswith('.md')]
    print(f"\t{len(files)} template markdown files found")
    return files

def main():
    """ Entry point """
    print('Replacing code snippets in template files:')
    md_files = get_template_files()
    for mdfile in md_files:
        build_md_file(mdfile)

if __name__ == '__main__':
    main()