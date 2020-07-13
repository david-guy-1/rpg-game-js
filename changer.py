# for every .tsx file in the src directory and all subdirectories:
#and every line
#apply the function f
#and write the result.
import os
import os.path
x  = os.walk(os.getcwd() + "/src")

###do not take into account new lines
##def op(line):
##    if("import" in line):
##        return line.replace(".tsx", "")
##    else:
##        return line

def op(line):
    if("constructor(props)" in line):
        return line.replace("constructor(props)", "constructor(props : any)")
    else:
        return line

def op_wrapper(line):
    if(len(line) >= 2 and line[-2] == "\r" and line[-1] == "\n"):
        true_line = line[0:len(line)-2]
    elif(line[-1] == "\n"):
        true_line = line[0:len(line)-1]
    else:
        true_line = line
    return op(true_line) + "\n"
    
for item in x:
    path = item[0]
    files = item[2]
    for file in files:
        if(not ".tsx" in file):
            continue
        
        other_folder = path.replace("\\","/").replace("/src","/src2")
        if(not os.path.isdir(other_folder)):
            os.mkdir(other_folder)
        this_path = path + "/" + file
        other_path = other_folder + "/" + file
        if(not os.path.exists(other_path)):
            open(other_path, "x")
        writing = open(other_path, "w")            
        with open(this_path, "r") as opened_file:
            for line in opened_file:
                writing.write(op_wrapper(line))
        writing.close()
print("all done")
        
