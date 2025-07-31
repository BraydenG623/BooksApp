from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
from werkzeug.security import generate_password_hash, check_password_hash



# Each book will have a title, author, publish year, key, and cover_id
# I have a one to many rel for user to books

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable = False, unique = True)
    password = db.Column(db.String, nullable = False)
    books = db.relationship('Book', back_populates = 'user', cascade='all, delete-orphan' )

    def set_password(self, plain):
        self.password = generate_password_hash(plain)


    #bool
    def check_password(self, plain):
        return check_password_hash(self.password, plain)

class Book(db.Model):
    __tablename__ = 'book'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable = False)
    author = db.Column(db.String)
    first_publish_year = db.Column(db.Integer)
    open_library_key = db.Column(db.String)
    cover_id = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) #tablename and col
    user = db.relationship('User', back_populates = 'books')
