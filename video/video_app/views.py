from django.shortcuts import render

# Create your views here.


def lobby(request):
    return render(request, 'video_app/lobby.html')


def room(request):
    return render(request, 'video_app/room.html')