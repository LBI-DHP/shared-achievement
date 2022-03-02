from unicodedata import category, name
from pychievements import Achievement, icons, tracker
from pychievements.backends import SQLiteAchievementBackend


backend = SQLiteAchievementBackend('shared_achievements.db')
tracker.set_backend(backend=backend)

class UserAchievement(Achievement):
    name = "Test Achievements"
    category = "user"
    keywords = ("test", "user")
    goals = (
        {"level": 10, "name": "Level 1", "icon": icons.star, "description": "Level One" },
        {"level": 20, "name": "Level 2", "icon": icons.star, "description": "Level Two" },
        {"level": 30, "name": "Level 3", "icon": icons.star, "description": "Level Three" },
    )

tracker.register(UserAchievement)