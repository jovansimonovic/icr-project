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
from rasa_sdk.events import SlotSet

# shows the list of all products
class ActionShowProducts(Action):

  def name(self) -> Text:
    return "action_show_products"

  def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # load product data from the JSON file
        products = load_data();

        dispatcher.utter_message(text="Here's a list of all the pets we offer:", attachment=products)

# shows the products that match the name
class ActionSearchByName(Action):
  
  def name(self) -> Text:
    return "action_search_by_name"

  def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get name from search query
        name = tracker.get_slot("name")

        if not name:
            dispatcher.utter_message(text="Please provide a name to search for")
            return []
        
        # remove the trailing "s" or "es" from the name (if applicable)
        name_singular = name[:-1] if name.endswith("s") or name.endswith("es") else name

        matching_pets = [pet for pet in pets if name_singular.lower() in pet["name"].lower()]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here are the results for {name}:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets with the name {name}")

        return [SlotSet("name", None)]

# shows the products that match the category
class ActionSearchByCategory(Action):
  
  def name(self) -> Text:
    return "action_search_by_category"

  def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get category from search query
        category = tracker.get_slot("category")

        if not category:
            dispatcher.utter_message(text="Please provide a category to search for")
            return []
        
        category_singular = category[:-1] if category.endswith("s") else category

        matching_pets = [pet for pet in pets if category_singular.lower() in pet["category"].lower()]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here are the results for {category}:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets in the category {category}")

        return [SlotSet("category", None)]

# shows the products cheaper than given price
class ActionSearchCheaperThan(Action):
    def name(self) -> Text:
        return "action_search_cheaper_than"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get price from search query
        price = tracker.get_slot("price")

        if not price:
            dispatcher.utter_message(text="Please provide a price to search for")
            return []
        
        matching_pets = [pet for pet in pets if pet["price"] <= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost less than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets that cost less than {price}€")

        return [SlotSet("price", None)]

# shows the products pricier than given price
class ActionSearchPricierThan(Action):
    def name(self) -> Text:
        return "action_search_pricier_than"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get price from search query
        price = tracker.get_slot("price")

        if not price:
            dispatcher.utter_message(text="Please provide a price to search for")
            return []
        
        matching_pets = [pet for pet in pets if pet["price"] >= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost more than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets that cost more than {price}€")

        return [SlotSet("price", None)]

# shows the products within a price range
class ActionSearchWithinPriceRange(Action):
    def name(self) -> Text:
        return "action_search_within_price_range"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")

        # get price_min and price_max from search query
        price_min = tracker.get_slot("price_min")
        price_max = tracker.get_slot("price_max")

        if not price_min or not price_max:
            dispatcher.utter_message(text="Please provide a price range to search for")
            return [SlotSet("price_min", None), SlotSet("price_max", None)]
        
        if price_min > price_max:
            dispatcher.utter_message(text="The minimum price must be less than the maximum price")
            return [SlotSet("price_min", None), SlotSet("price_max", None)]
        
        matching_pets = [pet for pet in pets if pet["price"] >= int(price_min) and pet["price"] <= int(price_max)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets priced between {price_min}€ and {price_max}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets priced between {price_min}€ and {price_max}€")

        return [SlotSet("price_min", None), SlotSet("price_max", None)]

# shows the products that match the age
# todo: develop this
class ActionSearchByAge(Action):
    def name(self) -> Text:
        return "action_search_by_age"

# shows the products that match the origin
class ActionSearchByOrigin(Action):
    def name(self) -> Text:
        return "action_search_by_origin"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get origin from search query
        origin = tracker.get_slot("origin")

        if not origin:
            dispatcher.utter_message(text="Please provide an origin to search for")

        matching_pets = [pet for pet in pets if origin.lower() in pet["origin"].lower()]

        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets from {origin}:", attachment=matching_pets)

        return [SlotSet("origin", None)]

# shows the products that match the size
class ActionSearchBySize(Action):
    def name(self) -> Text:
        return "action_search_by_size"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data();
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get size from search query
        size = tracker.get_slot("size")

        if not size:
            dispatcher.utter_message(text="Please provide a size to search for")

        matching_pets = [pet for pet in pets if size.lower() in pet["size"].lower()]

        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of {size}-sized pets:", attachment=matching_pets)

        return [SlotSet("size", None)]

# loads the data from JSON file
def load_data():
      products_file = Path("data/products.json")
      products = json.loads(products_file.read_text())
      return products

# generates an attachment message
def generate_attachment(products, dispatcher, message):
      data = products
      if (isinstance(products, list) and len(products)>0):
            dispatcher.utter_message(text=message, attachment=products)
            return[]
      
      dispatcher.utter_message(text="We failed to find any pets")