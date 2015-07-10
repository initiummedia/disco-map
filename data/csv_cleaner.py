f = open('2011DiscoResult_brief.csv', 'r')
text = f.read()
data = ''

code = 'A01'
for line in text.split('\n'):
    if line[:3] == code:
        data += line + '\n'
    elif line[0] == ',':
        data += code + line + '\n'
    else:
        code = line[:3]
        data += line + '\n'

result = ''
for line in data.split('\n'):
    if '*' in line:
        result += line + '\n'

print(result)

f = open('2011DiscoResult_concise.csv', 'w')
f.write(result)
f.close()

