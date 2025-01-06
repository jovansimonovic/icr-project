# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"
import json
from pathlib import Path
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionShowProducts(Action):

  def name(self) -> Text:
    return "action_show_products"

  def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # load product data from the JSON file
        products_file = Path("data/products.json")
        products = json.loads(products_file.read_text())

        dispatcher.utter_message(text="Here's a list of all the pets", attachment=products)

# generates an attachment message
def generate_attachment(products, dispatcher, message):
      data = products
      if (isinstance(list) and len(data)>0):
            dispatcher.utter_message(text=message, attachment=data)
            return[]
      
      dispatcher.utter_message(text="We failed to find any pets")