import random
from datetime import datetime, timedelta
from sqlmodel import Session, create_engine, select, func, inspect
from faker import Faker
from app.models.biosample import (BioSample, Comment)

fake = Faker()

DB_FILE = "database.db"
SAMPLE_COUNT = 100
COMMENT_MIN = 0
COMMENT_MAX = 5
SQLITE_URL = f"sqlite:///data/{DB_FILE}"

engine = create_engine(SQLITE_URL, echo=False)


def generate_fake_data():
    sample_types = ["Fries", "Water", "Chocolate", "Flour", "Wine", "Potato", "Puree", "Pea", "Plasma", "Tomato"]
    locations = ["Lab A", "Lab B", "Central Hospital", "Clinic", "Research Center", "Mobile Unit"]
    operators = ["Martin", "Dubois", "Petit", "Leroy", "Moreau", "Lefebvre", "Bernard", "Thomas"]

    with Session(engine) as session:

        for _ in range(SAMPLE_COUNT):

            fake_date = fake.date_between(start_date="-2y", end_date="today")

            sample = BioSample(
                created_at=datetime.now() - timedelta(days=random.randint(1, 700)),
                updated_at=datetime.now() - timedelta(days=random.randint(0, 30)),
                location=random.choice(locations),
                type=random.choice(sample_types),
                date=fake_date.strftime("%Y-%m-%d"),
                operator=random.choice(operators)
            )
            session.add(sample)
            session.commit()

            comment_count = random.randint(COMMENT_MIN, COMMENT_MAX)
            for _ in range(comment_count):
                comment = Comment(
                    created_at=datetime.now() - timedelta(days=random.randint(1, 365)),
                    updated_at=datetime.now() - timedelta(days=random.randint(0, 30)),
                    content=fake.paragraph(nb_sentences=random.randint(1, 3)),
                    biosample_id=sample.id
                )
                session.add(comment)

            session.commit()


def check_data():
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if "biosample" not in [table.lower() for table in tables]:
        print("No sample table found")
        return False

    with Session(engine) as session:

        sample_count = session.exec(select(func.count(BioSample.id))).one()
        print(f"Nombre total d'échantillons: {sample_count}")

        comment_count = session.exec(select(func.count(Comment.id))).one()
        print(f"Nombre total de commentaires: {comment_count}")

        samples = session.exec(select(BioSample).limit(5)).all()
        for sample in samples:
            print(f"\nÉchantillon ID: {sample.id}")
            print(f"  Type: {sample.type}")
            print(f"  Lieu: {sample.location}")
            print(f"  Date: {sample.date}")
            print(f"  Opérateur: {sample.operator}")

            comments = session.exec(select(Comment).where(Comment.biosample_id == sample.id)).all()
            print(f"  Nombre de commentaires: {len(comments)}")
            for i, comment in enumerate(comments[:3]):
                print(f"    Commentaire {i + 1}: {comment.content[:50]}...")

            if len(comments) > 3:
                print(f"    ... et {len(comments) - 3} autre(s) commentaire(s)")
        return True
