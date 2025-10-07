import argparse
import os

def consolidate_to_file(source_folder, dest_file, exclude_files=None, exclude_folders=None):
    """
    Consolidates the content of all files from a source folder into a single destination file,
    excluding specified files and folders.

    Args:
        source_folder (str): The path to the folder to consolidate files from.
        dest_file (str): The path to the single file where all content will be written.
        exclude_files (list, optional): A list of file names to exclude. Defaults to None.
        exclude_folders (list, optional): A list of folder names to exclude. Defaults to None.
    """
    if exclude_files is None:
        exclude_files = []
    if exclude_folders is None:
        exclude_folders = []

    try:
        # Open the destination file in write mode ('w'). This will create the file
        # if it doesn't exist and overwrite it if it does.
        with open(dest_file, 'w', encoding='utf-8') as outfile:
            for root, dirs, files in os.walk(source_folder):
                # Exclude specified folders from traversal
                dirs[:] = [d for d in dirs if d not in exclude_folders]

                for filename in files:
                    # Skip any files in the exclude list
                    if filename not in exclude_files:
                        source_path = os.path.join(root, filename)

                        # Write a clear separator with the file path to the output file
                        outfile.write(f"\n\n{'='*40}\n")
                        outfile.write(f"--- {source_path} ---\n")
                        outfile.write(f"{'='*40}\n\n")
                        print(f"Writing content from: {source_path}")

                        try:
                            # Open the source file and append its content to the destination file.
                            # errors='ignore' will prevent crashes if non-text files are encountered.
                            with open(source_path, 'r', encoding='utf-8', errors='ignore') as infile:
                                content = infile.read()
                                outfile.write(content)
                        except Exception as e:
                            error_message = f"--- Could not read file: {source_path} ({e}) ---\n"
                            outfile.write(error_message)
                            print(error_message)
    except IOError as e:
        print(f"Error: Could not write to destination file {dest_file}. Reason: {e}")
        return

    print(f"\nConsolidation complete. All content written to: {dest_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Consolidate the content of all files from a source folder into a single output file.",
        epilog="Example: python consolidate_to_file.py ./my_project ./all_code.txt -xf package-lock.json -xd node_modules .git"
    )
    parser.add_argument("source_folder", help="The source folder to consolidate files from.")
    parser.add_argument("dest_file", help="The destination file to write all content to. Will be overwritten if it exists.")
    parser.add_argument(
        "-xf",
        "--exclude-files",
        nargs="+",
        default=[],
        help="A list of file names to exclude."
    )
    parser.add_argument(
        "-xd",
        "--exclude-folders",
        nargs="+",
        default=[],
        help="A list of folder names to exclude."
    )

    args = parser.parse_args()

    consolidate_to_file(args.source_folder, args.dest_file, args.exclude_files, args.exclude_folders)