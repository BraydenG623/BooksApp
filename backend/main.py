import os
from flask import Flask, request, jsonify
from flask_cors  import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    get_jwt_identity, jwt_required
)
from dotenv import load_dotenv
import requests                          

# local imports 
from models import db, User, Book         


#load env's
load_dotenv()

app = Flask(__name__) 
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"]        = os.getenv("JWT_SECRET_KEY")
app.config['JWT_CSRF_METHODS'] = [] #to diable csrf
db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})  


#Helper
def book_to_dict(book):
    return {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "first_publish_year": book.first_publish_year,
        "open_library_key": book.open_library_key,
        "cover_id": book.cover_id,
        "user_id": book.user_id
    }

@app.post("/api/register")
def register():
    data = request.get_json() or {}
    if not {"username", "password"} <= data.keys():
        return {"error": "need user and pass"}, 400

    if User.query.filter_by(username=data["username"]).first():
        return {"error": "username taken"}, 409

    user = User(username=data["username"])
    user.set_password(data["password"])          
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return {"access_token": access_token}, 201

@app.post("/api/login")
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(username=data.get("username")).first()
    if not user or not user.check_password(data.get("password", "")):
        return {"error": "bad creds"}, 401

    return {"access_token": create_access_token(identity=user.id)}


def current_user():
    return User.query.get_or_404(get_jwt_identity())


@app.get("/api/openlibrary/search")
def api_search():
    q = request.args.get("q")
    if not q:
        return {"error": "q param doesnt exist"}, 400
    r = requests.get("https://openlibrary.org/search.json", params={"q": q})
    return r.json(), r.status_code


@app.route("/api/books", methods=["GET"])   
@jwt_required()                            
def list_books():
    books = []
    for bk in current_user().books:
        books.append(book_to_dict(bk))

    return jsonify(books)


@app.post("/api/books")
@jwt_required()
def add_book():
    data = request.get_json() or {}
    required = {"title"}
    if not required <= data.keys():
        return {"error": f"missing {required - data.keys()}"}, 400

    b = Book(
        title=data["title"],
        author=data.get("author"),
        first_publish_year=data.get("first_publish_year"),
        open_library_key=data.get("open_library_key"),
        cover_id=data.get("cover_id"),
        user=current_user()   
    )
    db.session.add(b) 
    db.session.commit()
    return book_to_dict(b), 201


@app.put("/api/books/<int:bid>")
@jwt_required()
def update_book(bid):
    book = Book.query.filter_by(id=bid, user_id=current_user().id).first_or_404()

    data = request.get_json()

    # update fields
    if "title" in data:
        book.title = data["title"]

    if "author" in data:
        book.author = data["author"]

    if "first_publish_year" in data:
        book.first_publish_year = data["first_publish_year"]

    if "open_library_key" in data:
        book.open_library_key = data["open_library_key"]

    if "cover_id" in data:
        book.cover_id = data["cover_id"]

    db.session.commit()
    return jsonify(book_to_dict(book)), 200



@app.delete("/api/books/<int:bid>")
@jwt_required()
def delete_book(bid):
    b = Book.query.filter_by(id=bid, user_id=current_user().id).first_or_404()
    db.session.delete(b)
    db.session.commit()
    return "", 204



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

