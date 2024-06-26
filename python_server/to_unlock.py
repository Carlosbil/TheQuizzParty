import logging
from achievements import *
from sqlalchemy.sql import func
from dataBase import Results
from collections import defaultdict

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)


class achiv_user():
    
    def __init__(self, user):
        self.user = user
        self.history_accerted = self.get_col_val("history_accerted")
        self.geography_accerted = self.get_col_val("geography_accerted")
        self.sports_accerted = self.get_col_val("sports_accerted")
        self.entertainment_accerted = self.get_col_val("entertainment_accerted")
        self.literature_accerted = self.get_col_val("literature_accerted")
        self.science_accerted = self.get_col_val("science_accerted")
        self.pop_culture_accerted = self.get_col_val("pop_culture_accerted")
        self.tinkers_win = self.get_col_val("tinkers_win")
        self.history_wrong = self.get_col_val("history_wrong")
        self.geography_wrong = self.get_col_val("geography_wrong")
        self.sports_wrong = self.get_col_val("sports_wrong")
        self.entertainment_wrong = self.get_col_val("entertainment_wrong")
        self.literature_wrong = self.get_col_val("literature_wrong")
        self.science_wrong = self.get_col_val("science_wrong")
        self.pop_culture_wrong = self.get_col_val("pop_culture_wrong")
        self.total_right = 0
        self.accerted_list = [self.history_accerted, self.geography_accerted, 
                              self.sports_accerted, self.entertainment_accerted, 
                              self.literature_accerted, self.science_accerted, 
                              self.pop_culture_accerted]
        self.wrong_list = [self.history_wrong, self.geography_wrong, 
                              self.sports_wrong, self.entertainment_wrong, 
                              self.literature_wrong, self.science_wrong, 
                              self.pop_culture_wrong]
        self.proportion_list = self.proportion_list = [(self.accerted_list[i] / (self.wrong_list[i] + self.accerted_list[i]) * 100)
                                                        if (self.wrong_list[i] + self.accerted_list[i]) != 0
                                                        else 0
                                                        for i in range(len(self.accerted_list))]

        self.TO_UNLOCK_MAP = {
            "Zeus": self.unlock_zeus_trophies,
            "Athena": self.unlock_athenea_trophies,
            "Dionysus": self.unlock_dionysus_trophies,
            "Ares": self.unlock_ares_trophies,
            "Hermes": self.unlock_hermes_trophies,
            "God of Gods": self.unlock_godofgods_trophies,
        }
        self.unlocked = list()
        
    def get_col_val(self, column_name):
        try:
            session = get_session()
            column = getattr(Results, column_name, None)
            result = session.query(column).filter(Results.username == self.user.username).first()
            if result:
                return result[0]
            else:
                return None 
        except Exception as e:
            # roll back if error
            session.rollback()
            message = "Error while saving the information at get_col_val"
            logging.error(f"{message}: {e}")
            return -1
        
        finally:
            session.close()
        

    def sumar_aciertos(self):
        for add_right in self.accerted_list:
            if add_right:
                # Asegúrate de que add_right es un entero antes de sumarlo.
                # Si add_right es una lista y quieres sumar todos sus elementos:
                if isinstance(add_right, list):
                    self.total_right += sum(add_right)
                else:
                    self.total_right += add_right

    def unlock_all(self):
        logging.debug(f"Unlocking trophies for user{self.user.username}")
        self.unlocked = [] if not self.unlocked else self.unlocked
        for troph in self.TO_UNLOCK_MAP:
            value = self.TO_UNLOCK_MAP[troph]()
            if value:
                self.unlocked.extend(self.TO_UNLOCK_MAP[troph]())

    def unlock_zeus_trophies(self):
        unlocked = list()
        self.sumar_aciertos()
        if self.total_right > 10:
            unlocked = [100,101,102]
        elif self.total_right > 5:
            unlocked = [100,101]
        elif self.total_right > 1:
            unlocked = [100]
        
        return unlocked

    def unlock_athenea_trophies(self):
        unlocked = list()
        categories = {
            'sports_accerted': {10: 200, 100: 201, 500: 202},
            'history_accerted': {10: 203, 100: 204, 500: 205},
            'geography_accerted': {10: 206, 100: 207, 500: 208},
        }
        
        
        for category, thresholds in categories.items():
            accerted = getattr(self, category, 0)
            for threshold, trophy in sorted(thresholds.items()):
                if accerted > threshold:
                    unlocked.append(trophy)
        return unlocked

    def unlock_hermes_trophies(self):
        return [3]

    def unlock_dionysus_trophies(self):
        return [4]

    def unlock_ares_trophies(self):
        return [5]

    def unlock_godofgods_trophies(self):
        return [6]

    def unlock_hermes_trophies(self):
        return [7]



ZEUS_MAP = {
    "100": zeus_100,
}