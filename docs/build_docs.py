import os
from pathlib import Path

FILE_TAG = '[example]'
CODE_BLOCK_HEADER = '```typescript { name=<name>, category=example }'
CODE_BLOCK = '```'
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMPLATE_DIR = os.path.join(CURRENT_DIR, "templates")

def get_snippet_file_path(tag_line: str) -> str:
    """ Gets the snippet file abs path """
    snippet_file_rel_path = tag_line.replace(FILE_TAG, '').replace('(','').replace(')','').strip()
    snippet_file_abs_path = os.path.join(CURRENT_DIR, Path(snippet_file_rel_path))
    return snippet_file_abs_path

def get_snippet_name(tag_line: str) -> str:
    """ Gets name of snippet from tag line """
    snippet_file_abs_path = get_snippet_file_path(tag_line)
    return os.path.basename(snippet_file_abs_path).lower().replace('.ts', '')

def get_snippet_content(tag_line: str) -> str:
    """ Gets snippet text from referenced file """
    print(f"\t\tGetting snippet from: {tag_line}")
    snippet_file_abs_path = get_snippet_file_path(tag_line)
    snippet_content = Path(snippet_file_abs_path).read_text()
    return snippet_content

def build_template(template_file_name: str):
    """ Builds individual template markdown file"""
    print(f"\tBuilding file {template_file_name}")
    try:
        template_file_path = Path(os.path.join(TEMPLATE_DIR, template_file_name))
        output_file_path = Path(os.path.join(CURRENT_DIR, template_file_name))
        template_content = template_file_path.read_text().splitlines()
        for line_index in range(0, len(template_content)):
            if FILE_TAG in template_content[line_index]:
                tag_line = template_content[line_index]
                snippet_content = get_snippet_content(tag_line)
                snippet_name = get_snippet_name(tag_line)
                with output_file_path.open("a") as f:
                    f.write(f"{CODE_BLOCK_HEADER.replace('<name>', snippet_name)}\n")
                    f.write(f"{snippet_content}\n")
                    f.write(f"{CODE_BLOCK}\n")
            else:
                with output_file_path.open("a") as f:
                    f.write(f"{template_content[line_index]}\n") 
    except Exception as e:
        print(f"\tUnable to build file {template_file_name}")
        raise e

def get_template_files() -> []:
    """ Gets list of template markdown files to process"""
    files = [f.lower() for f in os.listdir(TEMPLATE_DIR) if f.endswith('.md')]
    print(f"\t{len(files)} template markdown files found")
    return files

def main():
    """ Entry point """
    print('Replacing code snippets in template files:')
    md_files = get_template_files()
    for mdfile in md_files:
        build_template(mdfile)

if __name__ == '__main__':
    main()