FROM ubuntu:22.04

# 非対話モードに設定
ENV DEBIAN_FRONTEND=noninteractive

# システムパッケージのインストール
RUN apt-get update && apt-get install -y \
    bash \
    ca-certificates \
    curl \
    git \
    gnupg \
    python3 \
    python3-pip \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Node.js 18.x のインストール
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# ユーザー設定用の引数
ARG USER_NAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

# グループとユーザーの作成
RUN groupadd --gid ${USER_GID} ${USER_NAME} || true \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m -s /bin/bash ${USER_NAME} \
    && echo "${USER_NAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# npm グローバルディレクトリの設定
ENV NPM_CONFIG_PREFIX="/home/${USER_NAME}/.npm-global"
ENV PATH="/home/${USER_NAME}/.npm-global/bin:${PATH}"

# ユーザーに切り替え
USER ${USER_NAME}

# npm グローバルディレクトリの作成
RUN mkdir -p /home/${USER_NAME}/.npm-global

# ワークスペースディレクトリの設定
WORKDIR /workspace

# Claude CLI インストールスクリプトの作成
USER root
RUN echo '#!/bin/bash\n\
if [ -n "$CLAUDE_INSTALL_CMD" ]; then\n\
    echo "Installing Claude CLI with custom command..."\n\
    eval "$CLAUDE_INSTALL_CMD"\n\
elif [ -f /workspace/bin/claude ]; then\n\
    echo "Installing Claude CLI from local binary..."\n\
    mkdir -p /home/'${USER_NAME}'/.npm-global/bin\n\
    cp /workspace/bin/claude /home/'${USER_NAME}'/.npm-global/bin/claude\n\
    chmod +x /home/'${USER_NAME}'/.npm-global/bin/claude\n\
else\n\
    echo "Installing Claude CLI from npm..."\n\
    npm install -g @anthropic-ai/claude-code\n\
fi\n\
echo "Claude CLI installation completed!"' > /usr/local/bin/install-claude \
    && chmod +x /usr/local/bin/install-claude \
    && chown ${USER_NAME}:${USER_NAME} /usr/local/bin/install-claude

USER ${USER_NAME}

# Claude CLI のインストール
RUN /usr/local/bin/install-claude

# デフォルトコマンド
CMD ["/bin/bash"]
