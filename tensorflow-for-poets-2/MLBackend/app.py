from flask import Flask
from flask import request
from scripts.label_image import backend_do_labeling
from flask_cors import CORS
from flask import send_file
import json
import uuid
import os

app = Flask(__name__)
CORS(app)

last_result = ""


@app.route('/examine', methods=["POST", "GET"])
def ExamineImage():

    if request.method == 'GET':
        return 'You have gotten Lee\'s test!'

    if request.method == 'POST':
        image = request.files['file']
        image.save('../test/webTestFile.png')
        #return "Check if image has been saved"
        data = backend_do_labeling('../test/webTestFile.png')
        json_data = json.dumps(data)
        global last_result
        last_result = data['result']
        return json_data


@app.route('/getimage', methods=["GET"])
def GetImage():
    if request.method == 'GET':
        return send_file('../test/webTestFile.png', mimetype='image')


@app.route('/correct', methods=["GET", "POST"])
def labelCorrect():
    try:
        os.rename("../test/webTestFile.png", "../tf_files/cornPhotos/"
                     + last_result + "/" + str(uuid.uuid4()) + ".png")
        print("Image Moved to " + last_result)
    except:
        print "Error Moving Files."
    result = {}
    result['result'] = "true"
    return json.dumps(result)


@app.route('/notcorrect', methods=["GET", "POST"])
def labelNotCorrect():
    if last_result == 'rust':
        labelName = 'notrust'
    else:
        labelName = 'rust'
    try:
        os.rename("../test/webTestFile.png", "../tf_files/cornPhotos/"
                    + labelName + "/" + str(uuid.uuid4()) + ".png")
        print("Image Moved to " + labelName)
    except:
        print "Error Moving Files."
    result = {}
    result['result'] = "true"
    return json.dumps(result)


if __name__ == '__main__':
    app.run()
