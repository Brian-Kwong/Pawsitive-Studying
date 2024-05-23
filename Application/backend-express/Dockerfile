FROM public.ecr.aws/lambda/nodejs:20
#installing the dependencies
COPY package*.json ./
RUN npm install
# Copying the source code
COPY . .
# Default port for the express app
CMD [ "backend.handleStart"] 