import cohere
co = cohere.Client('Isa3T0jPfVHaRlBLLNetcGCJEMot56YO4JWqSk7w')

def summarization(prompt):
    prompt_summarized = co.summarize(prompt, length='short',format='paragraph',)
    response_summarized = co.summarize(response, length='short',format='paragraph',)
    return f"Prompt: {prompt_summarized.summary} \nResponse: {response_summarized.summary}"

# both the prompt and the response needs to have at least 250 characters each when calling the function

print(summarization("Private transportation is unsustainable due to several reasons. It has some  environmental impacts when using fossil fuel because it contributes to air pollution and  greenhouse gas emissions, then leading to climate issues as well as health issues. The usage of non-renewable energy is also a problem because it's resource depletion. Also,  it requires land in roadways, and parking lots which can lead to habitat loss and deforestation in some way. And it leads to traffic congestion which wastes time and fuel.", 
        "Every company or organization can arrange transportation services for their employees. After analyzing where their employees come from, the company can arrange buses/vans (according to the number of employees from a certain area). It leads to work in a timely manner since the employees have to come on time. People can use their private transportation in some cases. Overall, they should use the transportation service arranged by the company. Companies can charge a fair amount for the service from their wages. This will clear a lot of space occupied by private vehicles and it is a great thing."))



# Approach 2: having a fixed max-length (doesn't summarize completely)

# import cohere

# co = cohere.Client('Isa3T0jPfVHaRlBLLNetcGCJEMot56YO4JWqSk7w')

# def limit_output(output, max_length=200):
#     if len(output) <= max_length:
#         return output
#     else:
#         return output[:max_length]

# def summarization(prompt, response):
#     prompt_summarized = co.summarize(prompt, length='short', format='paragraph',)
#     response_summarized = co.summarize(response, length='short', format='paragraph',)
    
#     # Limiting the length of the summaries to 200 characters
#     prompt_summary = limit_output(prompt_summarized.summary)
#     response_summary = limit_output(response_summarized.summary)
    
#     return f"Prompt: {prompt_summary} \nResponse: {response_summary}"

# # Both the prompt and the response need to have at least 250 characters each when calling the function

# print(summarization(
#     "Private transportation is unsustainable due to several reasons. It has some environmental impacts when using fossil fuel because it contributes to air pollution and greenhouse gas emissions, then leading to climate issues as well as health issues. The usage of non-renewable energy is also a problem because it's resource depletion. Also, it requires land in roadways, and parking lots which can lead to habitat loss and deforestation in some way. And it leads to traffic congestion which wastes time and fuel.",
#     "Every company or organization can arrange transportation services for their employees. After analyzing where their employees come from, the company can arrange buses/vans (according to the number of employees from a certain area). It leads to work in a timely manner since the employees have to come on time. People can use their private transportation in some cases. Overall, they should use the transportation service arranged by the company. Companies can charge a fair amount for the service from their wages. This will clear a lot of space occupied by private vehicles and it is a great thing."
# ))
