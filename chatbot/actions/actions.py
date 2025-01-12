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
import re

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
            dispatcher.utter_message(text="Please provide a name to search for.")
            return []
        
        # remove the trailing "s" or "es" from the name (if applicable)
        name_singular = name[:-1] if name.endswith("s") or name.endswith("es") else name

        matching_pets = [pet for pet in pets if name_singular.lower() in pet["name"].lower()]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here are the results for {name}:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets with the name {name}.")

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
            dispatcher.utter_message(text="Please provide a category to search for.")
            return []
        
        category_singular = category[:-1] if category.endswith("s") else category

        matching_pets = [pet for pet in pets if category_singular.lower() in pet["category"].lower()]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here are the results for {category}:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets in the category {category}.")

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
            dispatcher.utter_message(text="Please provide a price to search for.")
            return []
        
        matching_pets = [pet for pet in pets if pet["price"] <= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost less than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets that cost less than {price}€.")

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
            dispatcher.utter_message(text="Please provide a price to search for.")
            return []
        
        matching_pets = [pet for pet in pets if pet["price"] >= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost more than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets that cost more than {price}€.")

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
            dispatcher.utter_message(text="The minimum price must be less than the maximum price.")
            return [SlotSet("price_min", None), SlotSet("price_max", None)]
        
        matching_pets = [pet for pet in pets if pet["price"] >= int(price_min) and pet["price"] <= int(price_max)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets priced between {price_min}€ and {price_max}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets priced between {price_min}€ and {price_max}€.")

        return [SlotSet("price_min", None), SlotSet("price_max", None)]

# shows the products that match the age
class ActionSearchByAge(Action):
    def name(self) -> Text:
        return "action_search_by_age"

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
  
        # get age from search query
        age = tracker.get_slot("age")

        if not age:
            dispatcher.utter_message(text="Please provide an age to search for.")
            return [SlotSet("age", None)]
        
        valid_age_pattern = r"^^\d+(\.\d+)? (year|years|month|months)$"

        if not re.match(valid_age_pattern, age.lower()):
            dispatcher.utter_message(text="Please provide the age in a format '[number] years' or '[number] months'.")
            return [SlotSet("age", None)]

        matching_pets = [pet for pet in pets if pet["age"] == age.lower()]

        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that are {age} old:", attachment=matching_pets)

        return [SlotSet("age", None)]

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
            dispatcher.utter_message(text="Please provide an origin to search for.")

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
            dispatcher.utter_message(text="Please provide a size to search for.")

        matching_pets = [pet for pet in pets if size.lower() in pet["size"].lower()]

        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of {size}-sized pets:", attachment=matching_pets)

        return [SlotSet("size", None)]

# shows the products that match multiple criteria
class ActionSearchByMultipleCriteria(Action):
    def name(self) -> Text:
        return "action_search_by_multiple_criteria"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get slots from search query
        name = tracker.get_slot("name")
        category = tracker.get_slot("category")
        price_min = tracker.get_slot("price_min")
        price_max = tracker.get_slot("price_max")
        age = tracker.get_slot("age")
        origin = tracker.get_slot("origin")
        size = tracker.get_slot("size")

        if name:
            name_singular = name[:-1] if name.endswith("s") or name.endswith("es") else name

            pets = [pet for pet in pets if name.lower() in pet["name"].lower()]

        if category:
            category_singular = category[:-1] if category.endswith("s") else category

            pets = [pet for pet in pets if category_singular.lower() in pet["category"].lower()]

        if price_min and price_max:
            if price_min > price_max:
                dispatcher.utter_message(text="The minimum price must be less than the maximum price.")
                return [SlotSet("price_min", None), SlotSet("price_max", None)]
            
            pets = [pet for pet in pets if int(price_min) <= pet["price"] <= int(price_max)]

        if age:
            valid_age_pattern = r"^^\d+(\.\d+)? (year|years|month|months)$"
            
            if not re.match(valid_age_pattern, age.lower()):
                dispatcher.utter_message(text="Please provide the age in a format '[number] years' or '[number] months'.")
                return [SlotSet("age", None)]
            
            pets = [pet for pet in pets if age.lower() in pet["age"].lower()]

        if origin:
            pets = [pet for pet in pets if origin.lower() in pet["origin"].lower()]

        if size:
            pets = [pet for pet in pets if size.lower() in pet["size"].lower()]

        if pets:
            dispatcher.utter_message(text="Here's a list of pets that match your search criteria:", attachment=pets)
        else:
            dispatcher.utter_message(text="We have no pets that match your search criteria.")

        return [
            SlotSet("name", None),
            SlotSet("category", None),
            SlotSet("price", None),
            SlotSet("price_min", None),
            SlotSet("price_max", None),
            SlotSet("age", None),
            SlotSet("origin", None),
            SlotSet("size", None)
        ]

class ActionAddToCart(Action):
    def name(self) -> Text:
        return "action_add_to_cart"
    
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
            dispatcher.utter_message(text="Please provide a name to search for.")
            return []
        
        # remove the trailing "s" or "es" from the name (if applicable)
        name_singular = name[:-1] if name.endswith("s") or name.endswith("es") else name

        matching_pets = [pet for pet in pets if name_singular.lower() in pet["name"].lower()]

        if matching_pets:
            dispatcher.utter_message(
                text=f"Added {name_singular} to cart.",
                # attachment=matching_pets,
                json_message={
                    "actionType": "add_to_cart",
                    "products": matching_pets},
                )
        else:
            dispatcher.utter_message(text="We could not find a pet with that name.")

        return [SlotSet("name", None)]

# loads the data from JSON file
def load_data():
      products_file = Path("data/products.json")
      products = json.loads(products_file.read_text())
      return products
