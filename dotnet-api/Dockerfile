# Use the official .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["NetApi.csproj", "./"]
RUN dotnet restore "NetApi.csproj"

# Copy the remaining files and build
COPY . .
RUN dotnet publish "NetApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy the published app from the build environment
COPY --from=build /app/publish .

# Define the entry point for the application
ENTRYPOINT ["dotnet", "NetApi.dll"]