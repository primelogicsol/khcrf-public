from rembg import remove

input_path = r'C:\Users\Fayaz\OneDrive\Desktop\Copperware.png'
output_path = r'frontend\public\assets\images\issues\issue_10_transparent.png'

with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input_data = i.read()
        output_data = remove(input_data)
        o.write(output_data)
print("Done removing background!")
